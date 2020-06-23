export interface Posts {
  //  _id: string;
    user: string;
    text: string;
    name: string;
    avatar: string;
    likes: [Like];
    comments: [Comment];
    date : Date;
}

export interface  Like {
    user: string;
}

export interface  Comment {
    
    user: string;
    text: string;
    name: string;
    avatar: string;
    date : Date;
}

