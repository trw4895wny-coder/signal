import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const exampleProfiles = [
  {
    email: 'alex.chen@example.com',
    password: 'demo123456',
    full_name: 'Alex Chen',
    signals: ['learning-ai', 'perspective-systems', 'contribution-mentoring'],
  },
  {
    email: 'jordan.martinez@example.com',
    password: 'demo123456',
    full_name: 'Jordan Martinez',
    signals: ['availability-hiring', 'perspective-earlystage', 'contribution-advising'],
  },
  {
    email: 'sam.taylor@example.com',
    password: 'demo123456',
    full_name: 'Sam Taylor',
    signals: ['learning-healthcare', 'perspective-productled', 'contribution-speaking'],
  },
]

async function seedProfiles() {
  console.log('🌱 Seeding example profiles...\n')

  for (const profile of exampleProfiles) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: profile.email,
        password: profile.password,
        email_confirm: true,
      })

      if (authError) {
        console.error(`❌ Error creating user ${profile.email}:`, authError.message)
        continue
      }

      console.log(`✓ Created user: ${profile.email}`)

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: profile.email,
        full_name: profile.full_name,
      })

      if (profileError) {
        console.error(`❌ Error creating profile for ${profile.email}:`, profileError.message)
        continue
      }

      console.log(`✓ Created profile: ${profile.full_name}`)

      // Add signals
      const signalInserts = profile.signals.map((signal_id) => ({
        user_id: authData.user.id,
        signal_id,
      }))

      const { error: signalsError } = await supabase
        .from('user_signals')
        .insert(signalInserts)

      if (signalsError) {
        console.error(`❌ Error adding signals for ${profile.email}:`, signalsError.message)
        continue
      }

      console.log(`✓ Added ${profile.signals.length} signals\n`)
    } catch (error) {
      console.error(`❌ Unexpected error:`, error)
    }
  }

  console.log('✅ Seeding complete!')
}

seedProfiles()
