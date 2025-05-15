import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

class Color extends Model { }

Color.init(
    {
        color_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'color',
    }
);

export default Color;