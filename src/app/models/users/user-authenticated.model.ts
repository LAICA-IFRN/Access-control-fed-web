export class UserAuthenticatedModel {
    id: string;
    name: string;
    email: string;
    document: string;
    documentType: number;
    encodedImage: string;
    roles: UserRoles[];

    constructor(user?: any) {
        if (user) {
            this.id = user['id'];
            this.name = user['name'];
            this.email = user['email'];
            this.document = user['document'];
            this.documentType = user['document_type_id'];
            this.roles = [];
            const roles: any[] = user['user_role'];
            if (roles) {
                for (let index = 0; index < roles.length; index++) {
                    this.roles.push({id: roles[index].role.id, name: roles[index].role.name});
                }
            }
        }
    }
}

export interface UserRoles {
    id: number;
    name: string;
}
