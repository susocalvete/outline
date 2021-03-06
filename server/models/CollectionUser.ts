import { DataTypes, sequelize } from "../sequelize";

const CollectionUser = sequelize.define(
  "collection_user",
  {
    permission: {
      type: DataTypes.STRING,
      defaultValue: "read_write",
      validate: {
        isIn: [["read", "read_write", "maintainer"]],
      },
    },
  },
  {
    timestamps: true,
  }
);

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'models' implicitly has an 'any' type.
CollectionUser.associate = (models) => {
  CollectionUser.belongsTo(models.Collection, {
    as: "collection",
    foreignKey: "collectionId",
  });
  CollectionUser.belongsTo(models.User, {
    as: "user",
    foreignKey: "userId",
  });
  CollectionUser.belongsTo(models.User, {
    as: "createdBy",
    foreignKey: "createdById",
  });
};

export default CollectionUser;
