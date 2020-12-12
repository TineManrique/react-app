import React, { Component } from 'react'; 
import { actions } from 'react-redux-form';
import Menu from './MenuComponent';
import DishDetail from './DishdetailComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { postComment, fetchDishes, fetchComments, fetchPromos, fetchLeaders, postFeedback } from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = dispatch => ({
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  postFeedback: (firstname, lastname, telnum, email, agree, contactType, message) => 
      dispatch(postFeedback(firstname, lastname, telnum, email, agree, contactType, message)),
  fetchDishes: () => { dispatch(fetchDishes())},
  fetchComments: () => { dispatch(fetchComments())},
  fetchPromos: () => { dispatch(fetchPromos())},
  fetchLeaders: () => { dispatch(fetchLeaders())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))}
});

class Main extends Component {
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }

  render() {
    const HomePage = () => {
      return (
        <Home dish={this.props.dishes.dishes.find(dish => dish.featured)} 
      dishesLoading={this.props.dishes.isLoading}
      dishesErrMess={this.props.dishes.errMess}
      promosLoading={this.props.promotions.isLoading}
      promosErrMess={this.props.promotions.errMess}
      promotion={this.props.promotions.promotions.find(promotion => promotion.featured)}
      leadersLoading={this.props.leaders.isLoading}
      leadersErrMess={this.props.leaders.errMess}
      leader={this.props.leaders.leaders.find(leader => leader.featured)}></Home>
      );
    };

    const DishWithId = ({match}) => {
      return (
        <DishDetail dish={this.props.dishes.dishes.find(dish => dish.id === parseInt(match.params.dishId))} 
        isLoading={this.props.dishes.isLoading}
        errMess={this.props.dishes.errMess}
        commentsLoading={this.props.comments.isLoading}
        commentsErrMess={this.props.comments.errMess}
        comments={this.props.comments.comments.filter(comment => comment.dishId === parseInt(match.params.dishId))} 
        postComment={this.props.postComment}></DishDetail>
      );
    }

    const AboutUs = () => {
      return (
        <About leaders={this.props.leaders.leaders} 
        leadersLoading={this.props.leaders.isLoading}
        leadersErrMess={this.props.leaders.errMess}></About>
      );
    }

    return (
      <div>
        <Header></Header>
        <TransitionGroup>
            <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch>
              <Route path="/home" component={HomePage}></Route>
              <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes}></Menu>}></Route>
              <Route path="/menu/:dishId" component={DishWithId}></Route>
              <Route exact path='/contactus' component={() => 
                <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}
                />} />
              <Route exact path='/aboutus' component={AboutUs}/>
              <Redirect to="/home"></Redirect>
            </Switch>
            </CSSTransition>
          </TransitionGroup>
        <Footer></Footer>
      </div>
    );
  }

  onDishSelect(dishId) {
    this.setState({
        selectedDish: dishId
    })
}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
