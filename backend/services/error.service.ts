/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Error = mongoose.model('Errors');

export const createErrors = async (errorData: any, docTenant: { [x: string]: string; }, next: (arg0: any) => any) => {
  try {
    return new Promise(async resolve => {
      const errorSchema = new Schema({}, {
        strict: false,
        timestamps: true
      });
      const syncError = mongoose.model('SyncError', errorSchema, docTenant['tenantNo'] + '_syncError');
      await syncError.create(errorData, async (errSyncError: any, docSyncError: unknown) => {
        if (errSyncError) {
          return next(errSyncError);
        } else {
          return resolve(docSyncError);
        }
      });
    });
  } catch (error) {
    return next(error);
  }
};

export const getSyncError = async (syncError: mongoose.FilterQuery<{ createdAt: NativeDate; updatedAt: NativeDate; } & {}>, docTenant: { [x: string]: string; }, mPagination: mongoose.QueryOptions<{ createdAt: NativeDate; updatedAt: NativeDate; } & {}>, next: (arg0: any) => any) => {
  try {
    return new Promise(async resolve => {
      const syncErrorSchema = new Schema({}, {
        strict: false,
        timestamps: true
      });
      const SyncError = mongoose.model('SyncError', syncErrorSchema, docTenant['tenantNo'] + '_syncError');
      await SyncError.countDocuments(syncError, async (errSyncLogsCount: any, countSyncLogsCount: any) => {
        if (errSyncLogsCount) {
          return next(errSyncLogsCount);
        } else {
          await SyncError.find(syncError,  mPagination, async (errSyncError: any, docSyncError: any) => {
            if (errSyncError) {
              return next(errSyncError);
            } else {
              return resolve({
                logs: docSyncError,
                count: countSyncLogsCount
              });
            }
          });
        }
      });
    });
  } catch (error) {
    return next(error);
  }
};

export const insertErrors = async (errorData: any, next: (arg0: any) => any) => {
  try {
    return new Promise(async resolve => {
      await Error.create(errorData).then((docTemplate) => {
        return resolve(docTemplate);
      }).catch((errTemplate) => {
        return next(errTemplate);
      });
    });
  } catch (error) {
    return next(error);
  }
};