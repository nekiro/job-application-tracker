import { NotFoundError } from '../middlewares/errorHandler';
import User from '../models/user';
import mongoose from 'mongoose';

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundError('User not found');
    }

    res.send();
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const addJob = async (req, res, next) => {
  try {
    const { user } = req;

    const { name, level, status, company } = req.body;

    let companyObj = null;

    if (typeof company == 'object') {
      // if company is an object, we have to create and insert it too
      companyObj = {
        name: company.name,
        website: company.website,
        size: company.size,
      };

      user.companies.push(companyObj);
    } else if (typeof company == 'string') {
      // company is a string (id), so it already exists
      companyObj = user.companies.find((c) => c.id === company);
      if (!companyObj) {
        throw new NotFoundError('Company not found');
      }
    }

    // create job offer
    const jobOffer = {
      id: new mongoose.Types.ObjectId(),
      name,
      level,
      status,
      company: companyObj,
    };

    user.jobs.push(jobOffer);
    await user.save();

    res.send(jobOffer);
  } catch (err) {
    next(err);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const { user } = req;
    const { jobId } = req.params;

    const job = user.jobs.find((j) => j.id === jobId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    res.send(job);
  } catch (err) {
    next(err);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const { user } = req;

    res.send(user.jobs);
  } catch (err) {
    next(err);
  }
};

export const addCompany = async (req, res, next) => {
  try {
    const { user } = req;
    const { name, website, size } = req.body;

    const company = {
      id: new mongoose.Types.ObjectId(),
      name,
      website,
      size,
    };

    user.companies.push(company);
    await user.save();

    res.send(company);
  } catch (err) {
    next(err);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const { user } = req;

    res.send(user.companies);
  } catch (err) {
    next(err);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const { user } = req;
    const { companyId } = req.params;

    const company = user.companies.find((c) => c.id === companyId);
    if (!company) {
      throw new NotFoundError('Company not found');
    }

    res.send(company);
  } catch (err) {
    next(err);
  }
};
