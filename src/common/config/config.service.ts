import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
import * as corsConfig from './cors-config/cors-config.json';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    dotenv.config({ path: filePath });
    this.envConfig = this.validateEnv();
  }

  /**
   * Environment configuration
   */

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get port(): number {
    return +this.envConfig.PORT;
  }

  /**
   * Current Stage (NOT NODE_ENV)
   */
  get stage(): string {
    return this.envConfig.STAGE;
  }

  /**
   * Application
   */

  get appName(): string {
    return this.envConfig.APP_NAME;
  }

  get swaggerPrefix(): string {
    return this.envConfig.SWAGGER_PREFIX;
  }

  get corsAllowedOrigins(): string[] {
    return corsConfig[this.stage];
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateEnv(): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(3000),
      APP_NAME: Joi.string().required(),
      STAGE: Joi.string()
        .valid('development', 'integration', 'production')
        .default('development'),
      SWAGGER_PREFIX: Joi.string().default('swagger'),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      process.env,
      {
        allowUnknown: true,
      },
    );

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }
}
