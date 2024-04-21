export enum RoleType{
    ADMIN,
    USER
}
export interface SignupRequestPayload {
    username: string;
    email: string;
    password: string;
    role:string ;
}

