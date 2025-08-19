export type AggregateID = string;

export interface BaseEntityProps {
  id: AggregateID;
}

export interface CreateEntityProps<T> {
  id: AggregateID;
  props: T;
}

export abstract class EntityBase<EntityProps> {
  constructor({ id, props }: CreateEntityProps<EntityProps>) {
    this.setId(id);
    this.props = props;
  }

  protected readonly props: EntityProps;

  protected abstract _id: AggregateID;

  get id(): AggregateID {
    return this._id;
  }

  private setId(id: AggregateID): void {
    this._id = id;
  }

  public getProps(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }
}
