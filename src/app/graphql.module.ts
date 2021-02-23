import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {HttpLinkHandler} from 'apollo-angular/http/http-link';
import {ApolloCache} from '@apollo/client/cache/core/cache';
import {NormalizedCacheObject} from '@apollo/client/cache/inmemory/types';


const uri = '/graphql';

export function createApollo(httpLink: HttpLink): { link: HttpLinkHandler, cache: ApolloCache<NormalizedCacheObject> } {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
}
