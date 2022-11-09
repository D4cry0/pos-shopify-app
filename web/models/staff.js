import pkg from 'mongoose';
const { Schema, model } = pkg;

const StaffSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'Name is required']
    },
    pin: {
        type: String,
        require: [true, 'PIN is required'],
        unique: true
    },
});

StaffSchema.methods.toJSON = function() {
    const { __v, _id, pin, ...staff } = this.toObject();
    staff.uid = _id;
    return staff;
}


const Staff = model( 'Staff', StaffSchema );

export {
    Staff
}