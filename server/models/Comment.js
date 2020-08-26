// @flow
import { DataTypes, sequelize } from "../sequelize";

const Comment = sequelize.define(
  "comment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.DATE,
    },
    resolvedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    classMethods: {},
  }
);

Comment.associate = (models) => {
  Comment.belongsTo(models.User, {
    as: "user",
    foreignKey: "createdById",
  });
  Comment.belongsTo(models.Document, {
    as: "document",
    foreignKey: "documentId",
  });
  Comment.belongsTo(models.Comment, {
    as: "comment",
    foreignKey: "parentCommentId",
  });
};

export default Comment;
