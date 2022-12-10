import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rpmepnnvmxsnojtlamdl.supabase.co'
const supabaseKey = String(process.env.SUPABASE_KEY)
const supabase = createClient(supabaseUrl, supabaseKey)

export type Profile = {
  id: number,
  money: number,
  gems: number,
}

export async function createProfile(ID: number) {
  getProfile(ID).then(async function(profile: Profile | undefined) {
    if (profile == undefined) {
      const {error} = await supabase
                      .from('BobTheBot-Users')
                      .insert({
                        id: ID,
                        money: 0,
                      })
      if (error) {
        console.error(error)
      }
    } else {
      console.error("no")
    }
  })
}

export async function getProfile(ID: number): Promise<Profile | undefined> {
  const { data } = (await supabase
                   .from('BobTheBot-Users')
                   .select('*')
                   .eq('id', ID))
  if (data!.length > 0) {
    const profile: Profile = data![0]
    return profile
  }
  return undefined
}

export async function saveProfile(profile: Profile) {
  await supabase
  .from('BobTheBot-Users')
  .update(profile)
  .eq('id', profile.id)
}