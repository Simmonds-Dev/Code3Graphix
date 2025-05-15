import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

class Size extends Model { }

Size.init(
    {
        size_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'size',
    }
);

export default Size;