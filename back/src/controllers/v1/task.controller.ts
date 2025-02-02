import { NextFunction, Request, Response } from 'express';
import { body, header, param, query, validationResult } from 'express-validator';
import taskService from '../../services/v1/task.service';
import Utils from '../../common/Utils';
import Exceptions from '../../exceptions';

/**
 * @author 강성모(castleMo)
 * @since 2021/04/29
 *
 * @param req    Request
 * @param res    Response
 * @param next  NextFunction
 */
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Promise.all([
			header('Authorization')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isJWT()
				.withMessage('is not JWT value')
				.run(req),
			body('contents')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isLength({ min: 1, max: 50 })
				.withMessage('contents length must be greater than 1 or less than 50')
				.run(req),
			body('tags')
				.optional({ checkFalsy: true })
				.isArray()
				.withMessage('is not Array value')
				.bail()
				.isArray({ min: 1 })
				.withMessage('Array length must be greater than 1')
				.run(req),
			body('tags.*.tagId')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isString()
				.withMessage('is not String value')
				.bail()
				.isUUID('4')
				.withMessage('is not UUID version4 value')
				.run(req),
			body('tags.*.isMainTag')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isBoolean()
				.withMessage('is not Boolean value')
				.run(req),
			body('period')
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isObject()
				.withMessage('is not Object value')
				.custom((value) => {
					return value.start !== undefined && value.end !== undefined;
				})
				.withMessage('properties is empty')
				.run(req),
			body('important')
				.optional({ nullable: true })
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isInt({ min: 0, max: 3 })
				.withMessage('is not Number value')
				.bail()
				.run(req),
		]);

		// validation Error
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			const msg: string = Utils.mixingValidationErrorMessage(validationErrors);
			throw new Exceptions.WantodoException(10001, msg);
		}

		const { user } = res.locals;
		const { contents, tags, period, important } = req.body;
		const result = await taskService.createTask(user, contents, {
			tags,
			period,
			important,
		});
		res.status(200).send(result);
	} catch (err) {
		next(err);
	}
};

/**
 * @author 강성모(castleMo)
 * @since 2021/05/05
 *
 * @param req    Request
 * @param res    Response
 * @param next  NextFunction
 */
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Promise.all([
			header('Authorization')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isJWT()
				.withMessage('is not JWT value')
				.run(req),
			query('year')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isInt()
				.withMessage('is not Number value')
				.run(req),
			query('month')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isInt()
				.withMessage('is not Number value')
				.isInt({ min: 0, max: 11 })
				.withMessage('month size must be greater than 0 or less than 11')
				.run(req),
			query('day')
				.optional({ checkFalsy: true })
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isInt()
				.withMessage('is not Number value')
				.isInt({ min: 1, max: 31 })
				.withMessage('day size must be greater than 1 or less than 31')
				.run(req),
		]);

		// validation Error
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			const msg: string = Utils.mixingValidationErrorMessage(validationErrors);
			throw new Exceptions.WantodoException(10001, msg);
		}

		const { user } = res.locals;
		const { year, month, day } = req.query;

		const result = await taskService.getTasks(user, {
			year: Number(year),
			month: Number(month),
			day: Number(day),
		});
		res.status(200).send(result);
	} catch (err) {
		next(err);
	}
};

/**
 * @author 강성모(castleMo)
 * @since 2021/05/01
 *
 * @param req    Request
 * @param res    Response
 * @param next  NextFunction
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Promise.all([
			header('Authorization')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isJWT()
				.withMessage('is not JWT value')
				.run(req),
			body('contents')
				.optional({ checkFalsy: true })
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isLength({ min: 1, max: 50 })
				.withMessage('contents length must be greater than 1 or less than 50')
				.run(req),
			body('tags')
				.optional({ checkFalsy: true })
				.isArray()
				.withMessage('is not Array value')
				.bail()
				.isArray({ min: 1 })
				.withMessage('Array length must be greater than 1')
				.run(req),
			body('tags.*.tagId')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isString()
				.withMessage('is not String value')
				.bail()
				.isUUID('4')
				.withMessage('is not UUID version4 value')
				.run(req),
			body('tags.*.isMainTag')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isBoolean()
				.withMessage('is not Boolean value')
				.run(req),
			body('period')
				.optional({ checkFalsy: true })
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isObject()
				.withMessage('is not Object value')
				.custom((value) => {
					return value.start !== undefined && value.end !== undefined;
				})
				.withMessage('not properties')
				.run(req),
			body('important')
				.optional({ nullable: true })
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isInt({ min: 0, max: 3 })
				.withMessage('is not Number value')
				.bail()
				.run(req),
		]);

		// validation Error
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			const msg: string = Utils.mixingValidationErrorMessage(validationErrors);
			throw new Exceptions.WantodoException(10001, msg);
		}

		const { user } = res.locals;
		const { taskId } = req.params;
		const { contents, tags, period, important } = req.body;
		const result = await taskService.updateTask(user, taskId, {
			contents,
			tags,
			period,
			important,
		});
		res.status(200).send(result);
	} catch (err) {
		next(err);
	}
};

/**
 * @author 강성모(castleMo)
 * @since 2021/04/30
 *
 * @param req    Request
 * @param res    Response
 * @param next  NextFunction
 */
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Promise.all([
			header('Authorization')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isJWT()
				.withMessage('is not JWT value')
				.run(req),
			param('taskId')
				.trim()
				.notEmpty()
				.withMessage('is empty')
				.bail()
				.isUUID('4')
				.withMessage('is not UUID version4 value')
				.run(req),
		]);

		// validation Error
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			const msg: string = Utils.mixingValidationErrorMessage(validationErrors);
			throw new Exceptions.WantodoException(10001, msg);
		}

		const { user } = res.locals;
		const { taskId } = req.params;
		const result = await taskService.deleteTask(user, taskId);
		res.status(200).send(result);
	} catch (err) {
		next(err);
	}
};

export default {
	createTask,
	getTasks,
	updateTask,
	deleteTask,
};
