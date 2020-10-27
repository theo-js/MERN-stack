import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { getItems, deleteItem } from '../actions/itemActions'
import PropTypes from 'prop-types'
import {
    Container,
    ListGroup,
    ListGroupItem,
    Button
} from 'reactstrap'

class ShoppingList extends React.Component {
    componentDidMount () {
        this.props.getItems()
    }

    onDeleteClick = _id => {
        this.props.deleteItem(_id)
    }

    render () {
        const { items } = this.props
        return <Container>
            <ListGroup>
                <TransitionGroup className="shopping-list">
                    {items.map(({ _id, name }) => (
                        <CSSTransition key={_id} timeout={500} classNames="fade">
                            <ListGroupItem>
                                <Button
                                    className="remove-btn"
                                    color="danger"
                                    size="sm"
                                    onClick={() => this.onDeleteClick(_id)}
                                >
                                    &times;
                                </Button>
                                &nbsp;{name}
                            </ListGroupItem>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </ListGroup>
        </Container>
    }
}

ShoppingList.propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
}

const mapStateToProps = state => ({ items: state.item.items })

export default connect(
    mapStateToProps,
    dispatch => ({
        getItems: () => dispatch(getItems()),
        deleteItem: _id => dispatch(deleteItem(_id))
    })
)(ShoppingList)