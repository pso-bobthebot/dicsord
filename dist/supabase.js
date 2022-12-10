"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProfile = exports.getProfile = exports.createProfile = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://rpmepnnvmxsnojtlamdl.supabase.co';
const supabaseKey = String(process.env.SUPABASE_KEY);
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
async function createProfile(ID) {
    getProfile(ID).then(async function (profile) {
        if (profile == undefined) {
            const { error } = await supabase
                .from('BobTheBot-Users')
                .insert({
                id: ID,
                money: 0,
            });
            if (error) {
                console.error(error);
            }
        }
        else {
            console.error("no");
        }
    });
}
exports.createProfile = createProfile;
async function getProfile(ID) {
    const { data } = (await supabase
        .from('BobTheBot-Users')
        .select('*')
        .eq('id', ID));
    if (data.length > 0) {
        const profile = data[0];
        return profile;
    }
    return undefined;
}
exports.getProfile = getProfile;
async function saveProfile(profile) {
    await supabase
        .from('BobTheBot-Users')
        .update(profile)
        .eq('id', profile.id);
}
exports.saveProfile = saveProfile;
//# sourceMappingURL=supabase.js.map