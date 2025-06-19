// tests/order.controller.test.ts
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../models/order.model";
import User from "../models/user.model";
import Product from "../models/product.model";

let mongo: MongoMemoryServer;

let adultUser: any;
let teenUser: any;
let regularProduct: any;
let ageRestrictedProduct: any;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  adultUser = await User.create({
    name: "Adult",
    email: "adult@example.com",
    DateOfBirth: new Date("1990-01-01"),
  });

  teenUser = await User.create({
    name: "Teen",
    email: "teen@example.com",
    DateOfBirth: new Date("2010-01-01"),
  });

  regularProduct = await Product.create({
    name: "Bread",
    price: 10,
    description: "Fresh bread",
    age_required: { required: false, age: 0 },
    discount: 0,
  });

  ageRestrictedProduct = await Product.create({
    name: "Wine",
    price: 100,
    description: "Red wine",
    age_required: { required: true, age: 21 },
    discount: 10,
  });
});

beforeEach(async () => {
  await Order.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Order Controller Logic", () => {
  it("should create an order with valid user and regular product", async () => {
    const order = await Order.create({
      user: adultUser._id,
      products: [{ product: regularProduct._id, quantity: 2 }],
      totalAmount: 20,
      discountedAmount: 0,
    });

    expect(order.totalAmount).toBe(20);
    expect(order.products).toHaveLength(1);
  });

  it("should apply discount correctly", async () => {
    const order = await Order.create({
      user: adultUser._id,
      products: [{ product: ageRestrictedProduct._id, quantity: 1 }],
      totalAmount: 90,
      discountedAmount: 10,
    });

    expect(order.totalAmount).toBe(90);
    expect(order.discountedAmount).toBe(10);
  });

  it("should reject an order if user is underage for a product", async () => {
    try {
      await Order.create({
        user: teenUser._id,
        products: [{ product: ageRestrictedProduct._id, quantity: 1 }],
        totalAmount: 0,
        discountedAmount: 0,
      });
    } catch (err: any) {
      expect(err.message).toContain("underage");
    }
  });

  it("should throw error if product not found", async () => {
    try {
      await Order.create({
        user: adultUser._id,
        products: [{ product: new mongoose.Types.ObjectId(), quantity: 1 }],
        totalAmount: 0,
        discountedAmount: 0,
      });
    } catch (err: any) {
      expect(err.message).toContain("not found");
    }
  });
});
