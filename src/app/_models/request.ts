type NewType = TransactionAttachment;

export class Request {    
    id: string;
    transactionId:number;
    memberId: number;
    onBehalfOf: number;
    onBehalfOfName:string;
    departmentId: number;
    departmentName:string;
    serviceRequestId:number;
    serviceRequestName: string;
    serviceDescriptionName:string;    
    assignedTo: number;
    assignedToName:string;
    isApprovalNeeded: boolean;
    isDeleted:boolean;
    approver:number;
    approverName:string;
    status:number;
    statusName:string;
    dateCreated:string;
    dateModified:string;
    lastModifiedBy:number;
    createdBy:string;
    transactionAttachments: NewType[];
}

export class TransactionAttachment
{
    fileExt: string;
    fileId: string;
    fileName: string;
    fileURI: string;
    isdeleted: boolean;
}