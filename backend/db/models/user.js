'use strict'
const { Model, Validator, Op } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, username, email } = this
      return { id, username, email }
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    }

    static getCurrentUserId(id) {
      return User.scope('currentUser').findByPk(id)
    }

    static async login({ credential, password }) {
      const user = await User.scope('loginCredentials').findOne({
        where: { [Op.or]: { username: credential, email: credential } },
      })

      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id)
      }
    }

    static async signUp({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password)
      const user = await User.create({
        username,
        email,
        hashedPassword,
      })
      console.log(user)
      return await User.scope('currentUser').findByPk(user.id)
    }

    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [7, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.')
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
        },
      },
      scopes: {
        currentUser: { exclude: ['hashedPassword'] },
        loginCredentials: {},
      },
    },
  )
  return User
}
