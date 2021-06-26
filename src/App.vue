<template>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

button {
  padding: 10px;
  margin: 3px;
  background-color: #e7e7e7;
  border: none;
  color: black;
  font-size: 1rem;

  &:hover {
    background-color: #aaa;
    transition: background-color 0.5s;
  }
}

input, select {
  padding: 10px;
  font-size: 1rem;

  &.invalid {
    border: 2px solid lightcoral !important;
  }

  &.dirty:not(.invalid) {
    border: 2px solid greenyellow !important;
  }
}

.action-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
