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
      type: DataTypes.TEXT,
    },
    resolvedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
  }
);

Comment.associate = (models) => {
  Comment.belongsTo(models.User, {
    as: "user",
    foreignKey: "createdById",
  });
  Comment.belongsTo(models.User, {
    as: "resolver",
    foreignKey: "resolvedById",
  });
  Comment.belongsTo(models.Document, {
    as: "document",
    foreignKey: "documentId",
  });
  Comment.belongsTo(models.Comment, {
    as: "parent",
    foreignKey: "parentCommentId",
  });
};

Comment.prototype.resolve = function (userId: string) {
  this.resolvedById = userId;
  this.resolvedAt = new Date();
  return this.save();
};

Comment.prototype.unresolve = function () {
  this.resolvedById = null;
  this.resolvedAt = null;
  return this.save();
};

export default Comment;
