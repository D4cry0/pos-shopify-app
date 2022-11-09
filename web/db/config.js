import mongoose from "mongoose";

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CNN );

        console.log('DB ON');
        

    } catch ( err ) {
        console.log( err );
        throw new Error('Error al inicializar la DB');
    }

}


export {
    dbConnection
}