import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

class Orders extends Model { }

Orders.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        partNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        size: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        urgency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        personalArtwork: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        filePath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // total_amount: {
        //     type: DataTypes.DECIMAL(10, 2),
        //     allowNull: false,
        //     defaultValue: 0.0
        // },
        // order_status: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     defaultValue: 'pending'
        // },
        // order_date: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        //     defaultValue: DataTypes.NOW
        // }
    },
    {
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'order',
        sequelize
    }
);

export default Orders;