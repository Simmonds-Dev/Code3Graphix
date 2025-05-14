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
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        order_status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending', // pending | processing | shipped | completed | canceled
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'order',
        sequelize
    }
);

export default Orders ;
