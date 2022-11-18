import mongoose from "mongoose";

let countTimeOut = 1;

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CNN );

        console.log('DB ON');
        

    } catch ( err ) {
        
        console.log('Error in DB connection', err );
        if( countTimeOut < 10){
            setTimeout( dbConnection, countTimeOut*1000);
        } else {
            console.log('Time exceded, restart server or try manual');
        }
        countTimeOut *= 2;
    }

}


export {
    dbConnection
}