/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const categories = categoriesFromServer.reduce(
  (acc, category) => ({
    ...acc,
    [category.id]: category,
  }),
  {},
);

const users = usersFromServer.reduce(
  (acc, user) => ({
    ...acc,
    [user.id]: user,
  }),
  {},
);

const initialProducts = productsFromServer.map(product => {
  const category = categories[product.categoryId];
  const user = users[category.ownerId];

  return {
    ...product,
    category: {
      ...category,
      icon: category.icon,
    },
    user,
  };
});

export const App = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);

  const handleFilterByUser = userId => {
    setSelectedUserId(userId);
    if (userId === null) {
      setProducts(initialProducts);
    } else {
      const filteredProducts = initialProducts.filter(
        product => product.user.id === userId,
      );

      setProducts(filteredProducts);
    }
    setSearchInput('');
    setShowClearButton(false);
  };

  const handleSearchInputChange = event => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    if (inputValue) {
      setShowClearButton(true);
      filterProductsByName(inputValue);
    } else {
      setShowClearButton(false);
      if (selectedUserId !== null) {
        handleFilterByUser(selectedUserId);
      } else {
        setProducts(initialProducts);
      }
    }
  };

  const filterProductsByName = searchText => {
    const filteredProducts = initialProducts.filter(product =>
      product.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    if (selectedUserId !== null) {
      const filteredByUser = filteredProducts.filter(
        product => product.user.id === selectedUserId,
      );
      setProducts(filteredByUser);
    } else {
      setProducts(filteredProducts);
    }
  };

  const handleClearSearchInput = () => {
    setSearchInput('');
    setShowClearButton(false);
    if (selectedUserId !== null) {
      handleFilterByUser(selectedUserId);
    } else {
      setProducts(initialProducts);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>
        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>
            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserId === null ? 'is-active' : ''}
                onClick={() => handleFilterByUser(null)}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={() => handleFilterByUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>
            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {showClearButton && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearSearchInput}
                    />
                  </span>
                )}
              </p>
            </div>
            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 2
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 4
              </a>
            </div>
            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>
        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" data-cy="NoMatchingMessage">
                    No products matching selected criteria
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      <span>
                        {product.category.icon} - {product.category.title}
                      </span>
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
