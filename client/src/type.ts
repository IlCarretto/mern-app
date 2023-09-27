export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    picturePath: string;
    friends: User[]; 
    location: string;
    occupation: string;
    viewedProfile: number;
    impressions: number;
    createdAt: number;
    updatedAt: number;
    __v: number;
}

export interface Post {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    location: string;
    description: string;
    picturePath: string;
    userPicturePath: string;
    likes: Record<string, boolean>;
    comments: string[];
    createdAt: Date;
    sharedNum?: number;
    isShared: Record<string, boolean>;
}

export interface IinitialValuesForm {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    location?: string;
    occupation?: string;
    picture?: {
        name: string;
    }
}

export interface IRegisterValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    location: string;
    occupation: string;
    picture: {
        name: string;
    }
    [key: string]: string | { name: string };
}

export interface ILoginValues {
    email: string;
    password: string;
}

export interface Options {
    inputValue: string;
    options: User[];
    loading: boolean;
}