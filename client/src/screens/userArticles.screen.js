import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableHighlight, View, ActivityIndicator, Image,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { USER_QUERY } from '../graphql/user.query';
import { ARTICLES_QUERY } from '../graphql/articles.query';
import AddButton from '../components/addButton';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:5,
    backgroundColor: "#dce0e8",
  },
  articleContainer: {
    flex: 1,
    width: '100%',
    height: 180,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#eee',
    borderWidth: 1.75,
    borderBottomColor: '#DDD',
    borderBottomWidth: 3.0,
    borderRadius: 10,
    paddingHorizontal:3,
    paddingVertical:10,
    marginBottom: 3,
    marginStart: '4%', 
  },
  price: {
    width: '50%',
    color: '#EF4413',
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignContent: 'center',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    borderRadius: 10,
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
  userImage: {
    width: 150,
    height: 135,
    borderRadius: 10,
  },
});

const Article = ({ goToInfoArticle, article: { id, name, price, image } }) => (
  <TouchableHighlight key={id} onPress={goToInfoArticle} underlayColor="transparent">
    <View style={styles.articleContainer}>
      <Image style={styles.userImage} source={{ uri: image }} />
      <Text style={styles.articleName}>{name}</Text>
      <Text style={styles.price}>{price}$</Text>
    </View>
  </TouchableHighlight>
);

Article.propTypes = {
  goToInfoArticle: PropTypes.func.isRequired,
  article: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
};

class Articles extends Component {
  static navigationOptions = {
    title: 'My Store',
  };

  keyExtractor = item => item.id.toString();

  goToInfoArticle = article => () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate('InfoArticles', { id: article.id, title: article.name, articleDescr: article.description, names: article.owner.username });
  };

  goToNewArticle = user => () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate('NewArticle', { id: user.id });
  };

renderItem = ({ item }) => <Article article={item} goToInfoArticle={this.goToInfoArticle(item)} />;

render() {
  const { loading, articles, user } = this.props;
  if (loading) {
    return (
      <View style={[styles.loading, styles.container]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList data={user.articles ? user.articles: undefined} numColumns={2} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
      <View>
        <AddButton onPress={this.goToNewArticle(user)}/>
      </View>
    </View>
  );
}
}
Articles.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string,
      owner: PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string,
      }),
    }),
  ),
};

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }), // fake the user for now
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});



export default compose(userQuery)(Articles);
