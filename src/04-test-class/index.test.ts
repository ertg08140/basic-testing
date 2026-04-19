// Uncomment the code below and write your tests
import { BankAccount, getBankAccount, SynchronizationFailedError } from '.';

describe('BankAccount', () => {
  let account: BankAccount;
  const initialBalance = 10;
  beforeEach(() => {
    account = getBankAccount(initialBalance);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toEqual(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(initialBalance + 1)).toThrow(
      `Insufficient funds: cannot withdraw more than ${initialBalance}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() =>
      account.transfer(initialBalance + 1, getBankAccount(10)),
    ).toThrow(
      `Insufficient funds: cannot withdraw more than ${initialBalance}`,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(initialBalance + 1, account)).toThrow(
      `Transfer failed`,
    );
  });

  test('should deposit money', () => {
    account.deposit(1);
    const newBalance = account.getBalance();
    expect(newBalance).toEqual(11);
  });

  test('should withdraw money', () => {
    account.withdraw(1);
    const newBalance = account.getBalance();
    expect(newBalance).toEqual(9);
  });

  test('should transfer money', () => {
    const newAccount = getBankAccount(10);
    account.transfer(5, newAccount);
    expect(account.getBalance()).toEqual(5);
    expect(newAccount.getBalance()).toEqual(15);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = await account.fetchBalance();
    if (balance !== null) {
      expect(balance).toEqual(expect.any(Number));
    } else {
      expect(balance).toBeNull();
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toEqual(1);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
