export class User {
    id: string;
    firstName: string;
    lastName: string;
    departmentId:number;
    departmentName:string;
    roleType: number;
    roleName: string;
    email:string;    
    userName: string;
    password: string;
    location:string;
    isGKPUser:boolean;
    isAccountManager:boolean;
    accountManager:number;  
    accountManagerName: string; 
    dateCreated:string;
    dateModified:string;
    //isDeeleted: false; correction
    token: string;
}