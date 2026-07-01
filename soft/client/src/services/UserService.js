import { sharedInstance } from "@/utils/api";

class UsersService {

    static async getInfo(){
        return sharedInstance.get('/info')
    }

    static async createOrder(form){
        return sharedInstance.post('/create-order', form )
    }
}

export default UsersService;
