import { response, request } from 'express';
import bcryptjs from 'bcryptjs';

import { Staff } from '../models';

export const staffGet = async(req, res = response) => {

    const { pin, shopDomain } = req.query;
    const query = { pin, shopDomain };

    const [ staff ] = await Promise.all([ 
        Staff.find(query)
     ])

    res.json({
        staff
    });
}