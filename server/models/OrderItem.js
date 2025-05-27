import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

class OrderItem extends Model { }

OrderItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'order',
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'product',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        size: {
            type: DataTypes.STRING,
            allowNull: true
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // unit_price: {
        //     type: DataTypes.DECIMAL(10, 2),
        //     allowNull: false
        // }
    },
    {
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'order_item',
        sequelize
    }
);

export default OrderItem;
