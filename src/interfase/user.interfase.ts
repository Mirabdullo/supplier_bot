export interface IUser {
    id: string;
    name?: string;
    phone: string;
    password: string;
    company_id: string;
    role: string;
    comp_id?: string
    is_active: boolean;
}
