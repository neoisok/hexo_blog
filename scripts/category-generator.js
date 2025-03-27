'use strict';

const pagination = require('hexo-pagination');

hexo.extend.generator.register('custom_category', function (locals) {
  // 定义你想要生成的分类页面
  const categories = ['Springboot', 'Mybatis', 'Maven'];

  let result = [];

  categories.forEach(category => {
    // 过滤分类对应的文章
    const posts = locals.posts.filter(post => {
      return post.categories.map(c => c.name).includes(category);
    });

    // 生成分页页面（每页10篇文章）
    const categoryPages = pagination(category, posts, {
      perPage: 10,
      layout: ['category', 'archive', 'index'], // 主题提供的布局，Butterfly一般都有category布局
      data: {
        category: category,
        type: 'category',
      },
    });

    result = result.concat(categoryPages);
  });

  return result;
});
