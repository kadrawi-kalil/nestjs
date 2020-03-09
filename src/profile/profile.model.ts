export interface Profile {
    _id: string;
    user: string;
    handle: string;
    company: string;
    website: string;
    location:string;
    status: string;
    skills: [string];
    bio: string;
    githubusername: string;
    experience: [Experience];
    education: [Education];
    social : Social;
}

export interface  Experience {
    title: string;
    company: string;
    location: string;
    from: string;
    to: string;
    current: string;
    description: string;
}


export interface  Education {
    school: string;
    degree: string;
    fieldofstudy: string;
    from: string;
    to: string;
    current: string;
    description: string;
}

export interface  Social {
    youtube: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
}
