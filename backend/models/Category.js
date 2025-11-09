module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: 'cube'
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#D4AF37'
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    product_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 5.00
    },
    support_bonus_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    installment_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    max_installments: {
      type: DataTypes.INTEGER,
      defaultValue: 6
    },
    seo_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seo_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    seo_keywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'categories',
    indexes: [
      {
        fields: ['slug']
      },
      {
        fields: ['parent_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['is_featured']
      },
      {
        fields: ['sort_order']
      },
      {
        fields: ['level']
      }
    ],
    hooks: {
      beforeCreate: async (category) => {
        // Generate slug if not provided
        if (!category.slug) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }

        // Calculate level and path
        if (category.parent_id) {
          const parent = await Category.findByPk(category.parent_id);
          if (parent) {
            category.level = parent.level + 1;
            category.path = parent.path ? `${parent.path}/${category.slug}` : category.slug;
          }
        } else {
          category.level = 0;
          category.path = category.slug;
        }
      },
      beforeUpdate: async (category) => {
        // Update slug if name changed
        if (category.changed('name') && !category.changed('slug')) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }

        // Recalculate path if parent changed
        if (category.changed('parent_id')) {
          if (category.parent_id) {
            const parent = await Category.findByPk(category.parent_id);
            if (parent) {
              category.level = parent.level + 1;
              category.path = parent.path ? `${parent.path}/${category.slug}` : category.slug;
            }
          } else {
            category.level = 0;
            category.path = category.slug;
          }
        }
      }
    }
  });

  // Self-referencing association for subcategories
  Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });
  Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });

  // Instance methods
  Category.prototype.isSubcategory = function() {
    return this.parent_id !== null;
  };

  Category.prototype.hasChildren = function() {
    return this.product_count > 0;
  };

  Category.prototype.getFullPath = function() {
    return this.path || this.slug;
  };

  Category.prototype.getBreadcrumbs = async function() {
    const breadcrumbs = [];
    let current = this;
    
    while (current) {
      breadcrumbs.unshift({
        id: current.id,
        name: current.name,
        slug: current.slug,
        level: current.level
      });
      
      if (current.parent_id) {
        current = await Category.findByPk(current.parent_id);
      } else {
        current = null;
      }
    }
    
    return breadcrumbs;
  };

  Category.prototype.updateProductCount = async function() {
    const { Product } = require('./index');
    const count = await Product.count({
      where: {
        category_id: this.id,
        status: 'active'
      }
    });
    
    this.product_count = count;
    await this.save(['product_count']);
    return this;
  };

  // Class methods
  Category.getHierarchy = async function() {
    const categories = await Category.findAll({
      where: { status: 'active' },
      order: [['level', 'ASC'], ['sort_order', 'ASC'], ['name', 'ASC']]
    });

    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          ...item.toJSON(),
          children: buildTree(items, item.id)
        }));
    };

    return buildTree(categories);
  };

  Category.getFeatured = async function() {
    return await Category.findAll({
      where: {
        status: 'active',
        is_featured: true
      },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
  };

  Category.search = async function(query) {
    const { Op } = require('sequelize');
    return await Category.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { seo_keywords: { [Op.iLike]: `%${query}%` } }
        ]
      },
      order: [['name', 'ASC']]
    });
  };

  return Category;
};