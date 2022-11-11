import pkg from 'mongoose';
const { Schema, model } = pkg;

const StaffSchema = Schema({
    name: {
        type: String,
        require: [true, 'Name is required']
    },
    uid: {
        type: String,
        require: [true, 'UID is required'],
        unique: true
    },
    shopDomain: {
        type: String,
        require: [true, 'Shop Domain is required'],
    },
    fulFillLocationId: {
        type: String,
        require: [true, 'Fulfill Location ID is required'],
    },
    fulFillLocationName: {
        type: String,
        require: [true, 'Fulfill Location Name is required'],
    },
});

StaffSchema.methods.toJSON = function() {
    const { __v, _id, uid, ...staff } = this.toObject();
    staff.dbId = _id;
    return staff;
}


const Staff = model( 'Staff', StaffSchema );

export {
    Staff
}