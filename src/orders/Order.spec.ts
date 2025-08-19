import { Order, OrderStatus } from './Order';

describe('Order', () => {
  describe('create', () => {
    it('should create a new order with initial values', () => {
      const order = Order.create();

      expect(order).toBeInstanceOf(Order);
      expect(order.getStatus()).toBe(OrderStatus.NEW);
      expect(order.getTotalPrice()).toBe(0);
      expect(order['props'].meals).toEqual([]);
      expect(order['_id']).toBeDefined();
    });
  });

  describe('addMeal', () => {
    let order: Order;

    beforeEach(() => {
      order = Order.create();
    });

    it('should add a new meal to the order', () => {
      order.addMeal('meal1', 'Pizza Margherita', 12.5, 2);

      expect(order['props'].meals).toHaveLength(1);
      expect(order['props'].meals[0]).toEqual({
        mealId: 'meal1',
        name: 'Pizza Margherita',
        quantity: 2,
        price: 12.5,
      });
      expect(order.getTotalPrice()).toBe(25.0);
    });

    it('should add a meal with default quantity of 1', () => {
      order.addMeal('meal1', 'Pizza Margherita', 12.5);

      expect(order['props'].meals[0].quantity).toBe(1);
      expect(order.getTotalPrice()).toBe(12.5);
    });

    it('should increase quantity when adding the same meal twice', () => {
      order.addMeal('meal1', 'Pizza Margherita', 12.5, 2);
      order.addMeal('meal1', 'Pizza Margherita', 12.5, 1);

      expect(order['props'].meals).toHaveLength(1);
      expect(order['props'].meals[0].quantity).toBe(3);
      expect(order.getTotalPrice()).toBe(37.5);
    });

    it('should add different meals separately', () => {
      order.addMeal('meal1', 'Pizza Margherita', 12.5, 1);
      order.addMeal('meal2', 'Caesar Salad', 8.0, 2);

      expect(order['props'].meals).toHaveLength(2);
      expect(order.getTotalPrice()).toBe(28.5);
    });

    it('should throw error when adding meal to non-new order', () => {
      order.changeStatus(OrderStatus.IN_THE_KITCHEN);

      expect(() => {
        order.addMeal('meal1', 'Pizza', 10);
      }).toThrow('Cannot add meals to an order that is not new');
    });

    it('should throw error when quantity is zero or negative', () => {
      expect(() => {
        order.addMeal('meal1', 'Pizza', 10, 0);
      }).toThrow('Quantity must be greater than 0');

      expect(() => {
        order.addMeal('meal1', 'Pizza', 10, -1);
      }).toThrow('Quantity must be greater than 0');
    });

    it('should throw error when price is negative', () => {
      expect(() => {
        order.addMeal('meal1', 'Pizza', -5);
      }).toThrow('Price cannot be negative');
    });

    it('should handle price of zero', () => {
      order.addMeal('meal1', 'Free Sample', 0, 1);

      expect(order['props'].meals[0].price).toBe(0);
      expect(order.getTotalPrice()).toBe(0);
    });
  });

  describe('changeStatus', () => {
    let order: Order;

    beforeEach(() => {
      order = Order.create();
    });

    it('should change status from NEW to IN_THE_KITCHEN', () => {
      order.changeStatus(OrderStatus.IN_THE_KITCHEN);

      expect(order.getStatus()).toBe(OrderStatus.IN_THE_KITCHEN);
    });

    it('should change status from IN_THE_KITCHEN to IN_DELIVERY', () => {
      order.changeStatus(OrderStatus.IN_THE_KITCHEN);
      order.changeStatus(OrderStatus.IN_DELIVERY);

      expect(order.getStatus()).toBe(OrderStatus.IN_DELIVERY);
    });

    it('should change status from IN_DELIVERY to DONE', () => {
      order.changeStatus(OrderStatus.IN_THE_KITCHEN);
      order.changeStatus(OrderStatus.IN_DELIVERY);
      order.changeStatus(OrderStatus.DONE);

      expect(order.getStatus()).toBe(OrderStatus.DONE);
    });

    it('should throw error for invalid status transitions', () => {
      expect(() => {
        order.changeStatus(OrderStatus.IN_DELIVERY);
      }).toThrow('Invalid status transition from new to inDelivery');

      expect(() => {
        order.changeStatus(OrderStatus.DONE);
      }).toThrow('Invalid status transition from new to done');
    });

    it('should throw error when trying to change from DONE status', () => {
      order.changeStatus(OrderStatus.IN_THE_KITCHEN);
      order.changeStatus(OrderStatus.IN_DELIVERY);
      order.changeStatus(OrderStatus.DONE);

      expect(() => {
        order.changeStatus(OrderStatus.NEW);
      }).toThrow('Invalid status transition from done to new');
    });

    it('should throw error for backward transitions', () => {
      order.changeStatus(OrderStatus.IN_THE_KITCHEN);

      expect(() => {
        order.changeStatus(OrderStatus.NEW);
      }).toThrow('Invalid status transition from inTheKitchen to new');
    });
  });
});
