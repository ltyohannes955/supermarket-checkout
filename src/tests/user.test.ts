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

import User from "../models/user.model";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User Controller", () => {
  it("should create a user successfully", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      DateOfBirth: new Date("1990-01-01"),
    };
    const user = new User(userData);
    const saved = await user.save();

    expect(saved._id).toBeDefined();
    expect(saved.name).toBe(userData.name);
    expect(saved.email).toBe(userData.email);
  });

  it("should fail to create a user with missing required fields", async () => {
    const user = new User({});
    let error;
    try {
      await user.save();
    } catch (err: any) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it("should get all users", async () => {
    await User.create([
      {
        name: "Alice",
        email: "alice@example.com",
        DateOfBirth: new Date("1980-01-01"),
      },
      {
        name: "Bob",
        email: "bob@example.com",
        DateOfBirth: new Date("1985-01-01"),
      },
    ]);
    const users = await User.find();
    expect(users.length).toBe(2);
  });

  it("should get user by valid ID", async () => {
    const user = await User.create({
      name: "Charlie",
      email: "charlie@example.com",
      DateOfBirth: new Date("1995-01-01"),
    });
    const found = await User.findById(user._id);
    expect(found).not.toBeNull();
    expect(found!.name).toBe("Charlie");
  });

  it("should return null for non-existing user ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const user = await User.findById(fakeId);
    expect(user).toBeNull();
  });

  it("should update a user", async () => {
    const user = await User.create({
      name: "Diana",
      email: "diana@example.com",
      DateOfBirth: new Date("1992-01-01"),
    });

    const updated = await User.findByIdAndUpdate(
      user._id,
      { name: "Diana Updated" },
      { new: true }
    );
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("Diana Updated");
  });

  it("should delete a user", async () => {
    const user = await User.create({
      name: "Eve",
      email: "eve@example.com",
      DateOfBirth: new Date("1988-01-01"),
    });

    await User.findByIdAndDelete(user._id);
    const deleted = await User.findById(user._id);
    expect(deleted).toBeNull();
  });
});
