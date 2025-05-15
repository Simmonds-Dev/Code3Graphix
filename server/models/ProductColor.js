import { Model, DataTypes } from'sequelize';
import sequelize from'../config/connection.js';

class ProductColor extends Model { }

ProductColor.init(
    {
        product_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'product',
                key: 'id',
            },
        },
        color_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'color',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'product_color',
    }
);

export default ProductColor;