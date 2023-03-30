
import * as dotenv from "dotenv";
dotenv.config();

import './backend/config/mongo';

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import nocache from 'nocache';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import expressEnforcesSSL from 'express-enforces-ssl';


//error
import * as errorService from './backend/services/error.service';

// routes
import {apisV1} from './backend/routes/api.route';


const app = express();
const port = process.env.PORT || 3005;
const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg', '.eot'];

const initiateAppListener = async() => {
    console.info('Initializing Node Server...');
    app.enable('trust proxy');

    if (app.get('env') === 'production') {
        app.use(expressEnforcesSSL());
    } else {
        app.use(cors());
    }

    app.use(helmet());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(helmet.xssFilter());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.dnsPrefetchControl());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.frameguard({ action: 'sameorigin' }));
    app.use(helmet.referrerPolicy({ policy: 'no-referrer-when-downgrade' }));

    app.use(helmet.hsts({
        preload: true,
        includeSubDomains: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
    }));
    app.use(nocache());

    app.use(bodyParser.raw({ limit: '50mb' }));
    app.use(bodyParser.text({ limit: '50mb' }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    app.use(cookieParser());

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT');
        res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, timezone');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=()');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'sameorigin');
        next();
    });

    // routes
    app.use('/api/v1/', apisV1);

    // error handling
    app.use(async (err, req, res, next) => {
        console.log(err);
        if (req.user) {
            const _request = req.user;
            const errorData = {
                userId: _request['userId'],
                email: _request['email'],
                tenantId: _request['tenantId'],
                error: err
            };
            await errorService.insertErrors(errorData, next);
        } else {
            const errorData = {
                userId: '',
                email: '',
                tenantId: '',
                error: err
            };
            await errorService.insertErrors(errorData, next);
        }
        if (err.name && err.name === 'ValidationError') {
            const validationErrors = [];
            Object.keys(err.errors).forEach(key => validationErrors.push(err.errors[key].message));
            res.status(422).send({
                success: false,
                error: true,
                status: 422,
                errors: validationErrors,
                title: err.title ? err.title : 'Validation error!',
                message: err.message ? err.message : 'Sorry, due to an validation error, we could not process your request at this time.'
            });
        } else if (err.formatter) {
            res.status(422).send({
                success: false,
                error: true,
                status: 422,
                errors: err.array(),
                title: err.title ? err.title : 'Validation error!',
                message: err.message ? err.message : 'Sorry, due to an validation error, we could not process your request at this time.'
            });
        } else if (err) {
            res.status(err.status ? err.status : 500).send({
                success: false,
                error: true,
                status: err.status ? err.status : 500,
                errors: err.errors ? err.errors : err,
                title: err.title ? err.title : 'Internal server error!',
                message: err.message ? err.message : 'Sorry, due to an internal server error, we could not process your request at this time.'
            });
        }
    });

    app.get('*', (req, res) => {
        if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
            const splitString = req.url.split('?');
            if (splitString && splitString[0]) {
                const safeSuffix = path.normalize(splitString[0]).replace(/^(\.\.(\/|\\|$))+/, '');
                const safeJoin = path.join('./web/', safeSuffix);
                res.sendFile(path.resolve(safeJoin));
            }
        } else {
            res.sendFile(path.resolve('./web/index.html'));
        }
    });

    app.on('error', (error) => {
        console.error(error);
    });

    process.on('uncaughtException', (error) => {
        console.error(error);
    });

    app.listen(port);

}

mongoose.connection.on('connected', () => {
    initiateAppListener().then(() => {
        console.log('\x1b[37m', '--------------------------------');
        console.log('\x1b[34m', ' MongoDB Initialized ✔');
        console.log('\x1b[37m', '--------------------------------');
        console.log('\x1b[32m', ' Node Server Initialized: ' + port);
        console.log('\x1b[37m', '--------------------------------');
    }).catch((error) => {
        console.error('ERROR:: Node Server Initialization Failed: ', error);
    });
});