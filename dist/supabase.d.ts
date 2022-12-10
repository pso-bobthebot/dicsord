export declare type Profile = {
    id: number;
    money: number;
    gems: number;
};
export declare function createProfile(ID: number): Promise<void>;
export declare function getProfile(ID: number): Promise<Profile | undefined>;
export declare function saveProfile(profile: Profile): Promise<void>;
//# sourceMappingURL=supabase.d.ts.map