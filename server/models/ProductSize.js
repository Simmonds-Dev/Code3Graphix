import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

class ProductSize extends Model { }

ProductSize.init(
    {
        product_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'product',
                key: 'id',
            },
        },
        size_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'size',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'product_size',
    }
);

export default ProductSize;