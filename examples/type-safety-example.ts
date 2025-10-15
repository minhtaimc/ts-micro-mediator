import { IQuery, ICommand, INotification, sendRequest, publishNotification } from '../src/index.js';
import { Result } from 'ts-micro-result';

// Example request types
class GetUserQuery implements IQuery<User> {
  readonly _response?: User;
  constructor(public userId: string) {}
}

class CreateUserCommand implements ICommand<User> {
  readonly _response?: User;
  constructor(public name: string, public email: string) {}
}

class UserDeletedNotification implements INotification {
  constructor(public userId: string, public deletedAt: Date) {}
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Example usage with improved type safety
async function exampleUsage() {
  // Type-safe query - TypeScript knows this returns Promise<Result<User>>
  const userResult: Result<User> = await sendRequest(new GetUserQuery('123'));
  
  if (userResult.isOk()) {
    const user: User | null = userResult.data; // Type-safe access to user data
    if (!user) {
      console.warn('Query returned no user data');
      return;
    }
    console.log(`User: ${user.name} (${user.email})`);
  } else {
    console.error(`Error: ${userResult.errors[0]?.message ?? 'Unknown error'}`);
  }

  // Type-safe command - TypeScript knows this returns Promise<Result<User>>
  const createResult = await sendRequest(new CreateUserCommand('John Doe', 'john@example.com'));
  
  if (createResult.isOk() && createResult.data) {
    const newUser: User = createResult.data; // Type-safe access
    console.log(`Created user: ${newUser.id}`);
  }

  // Type-safe notification - TypeScript knows this returns Promise<void>
  await publishNotification(new UserDeletedNotification('123', new Date()));
}

// Example of how TypeScript now provides better IntelliSense
async function demonstrateTypeSafety() {
  // When you type "sendRequest(" - TypeScript will show:
  // sendRequest<TResponse>(request: IQuery<TResponse> | ICommand<TResponse>): Promise<Result<TResponse>>
  
  const result = await sendRequest(new GetUserQuery('123'));
  
  // TypeScript knows result is Result<User>, so you get autocomplete for:
  // result.isOk() - type guard for success branch
  // result.data - User | null
  // result.errors - ErrorDetail[]
  
  if (result.isOk() && result.data) {
    // TypeScript knows user is User type
    const user = result.data;
    console.log(user.name); // Autocomplete works for User properties
  }
}

export { exampleUsage, demonstrateTypeSafety }; 
