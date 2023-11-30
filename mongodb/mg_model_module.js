//mongodb model导出
//引入mongoose_connectdb_module.js到mongoose
const mongoose = require('./mg_connectdb_module');

//定义Schema

const Schema = mongoose.Schema;

//定workScheduleSchema
const workScheduleSchema = new Schema({

    employeename: {
        type: String,
        maxlength: 12
    },
    employeenumber: {
        type: String,
        maxlength: 6
    },
    workdate: {
        type: Date,
        required: true
    },
    shift: {
        type: String,
        enum: ['am', 'pm']
    },
    createdate: Date,
    position: {
        type: String,
        enum: ["host", "bartender", "server", "busser", "trainee"]
    },
    remarks: {
        type: String,
        maxlength: 50
    }

});

//定义employeeSchema

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 12
    },
    number: {
        type: String,
        required: true,
        unique: true,
        maxlength: 6
    },
    date: {
        type: Date,
        default: new Date(),
        required: true
    },
    position: {
        type: String,
        enum: ["host", "bartender", "server", "busser", "trainee"],
        required: true
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                // 检查 v 是否是 10 位数字
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} 不是一个有效的电话号码！`
        },
        unique: true,
        required: [true, '用户电话号码是必需的']
    },
    status: {
        type: String,
        default: "onJob",
        enum: ["onJob", "quit","vacation","partTime","others"],
        required: true
    },
    //设定预处理后得到的职位对应数字
    posNumber:{
        type:String
    },
    remarks: {
        type: String,
        maxlength: 50
    }

});

//添加预处理行为

employeeSchema.pre('save',function(next){
    if(this.position=="host"){
        this.posNumber="1";
    }else if(this.position=="bartender"){
        this.posNumber="2";
    }else if(this.position=="server"){
        this.posNumber="3";
    }else if(this.position=="busser"){
        this.posNumber="4";
    }else if(this.position=="trainee"){
        this.posNumber="5";
    };
    next();
})


//!------------------------------------------------------------------------------
//定义model

const WorkSchedule = mongoose.model('workSchedule', workScheduleSchema);

const Employee = mongoose.model('employee', employeeSchema);

//模块导出

module.exports = {
    WorkSchedule,
    Employee
};

// module.exports = workSchedule;