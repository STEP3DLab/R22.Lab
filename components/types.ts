export interface Article { id:string; title:string; excerpt:string; tags:string[]; date:string; cover?:string; }
export interface Course  { id:string; title:string; level:string; duration:string; summary:string; cover?:string; }
export interface Post    { id:string; title:string; date:string; body:string; }
export interface DataShape { articles: Article[]; courses: Course[]; posts: Post[]; }
