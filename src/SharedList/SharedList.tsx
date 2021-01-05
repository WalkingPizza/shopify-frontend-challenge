import React from 'react';
import '@shopify/polaris/dist/styles.css';
import {
  Button,
  Layout,
  Page,
} from '@shopify/polaris';
import { Movie, MovieListType } from '../types';
import { RouteComponentProps } from 'react-router-dom';
import MovieList from '../MovieList';
import { getMovieByID } from '../handlers';

interface ISharedListProps {
  username: string,
  nominations: string
}

interface ISharedListState {
  isLoading: boolean,
  movies: Movie[]
}

export default class SharedList extends React.Component<RouteComponentProps<ISharedListProps>, ISharedListState> {

  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      movies: []
    }

    const movies = this.getMovies();

    Promise.all(movies).then((response) => {
        this.setState({
          isLoading: false,
          movies: response.filter((movie) => movie && movie.response)
        });
      }
    );   
  }

  getMovies = () => {
    const ids = this.props.match.params.nominations.split(",");
    return ids.map(async (id) => {
      const response = await getMovieByID(id);
      return response.movies[0];
    });
  }

  render() {
    

    return (
      <Page
        breadcrumbs={[{content: "Create your own list", onAction: () => this.props.history.push("/") }]}
        primaryAction={<Button primary onClick={() => window.print()}>Print</Button>}
      >
        <Layout>
          <Layout.Section>
            <MovieList
              title="Nominations"
              type={MovieListType.nominations}
              readOnly={true}
              isLoading={this.state.isLoading}
              movies={this.state.movies}
            />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}