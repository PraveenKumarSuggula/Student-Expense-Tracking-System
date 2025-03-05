import { Component } from '@angular/core';

interface FinancialContent {
  title: string;
  type: 'Video' | 'Article';
  description: string;
  url: string;
}

@Component({
  selector: 'app-financial-advice',
  templateUrl: './financial-advice.component.html',
  styleUrls: ['./financial-advice.component.scss']
})
export class FinancialAdviceComponent {
  financialContents: FinancialContent[] = [
    {
      title: 'Budget Management 101: A Step-by-Step Guide',
      type: 'Article',
      description: 'This comprehensive article walks you through the basics of managing your budget effectively, providing tips to track expenses and save money.',
      url: 'https://cleverfoxplanner.com/blogs/articles/budgeting-101-how-to-start-budgeting'
    },
    {
      title: 'Top 5 Money-Saving Tips You Need to Know',
      type: 'Video',
      description: 'Watch this engaging video to discover practical money-saving strategies that can help you boost your savings without compromising your lifestyle.',
      url: 'https://www.youtube.com/watch?v=L1vOty8pUOY'
    },
    {
      title: 'Investing for Beginners: Where to Start',
      type: 'Article',
      description: 'If you’re new to investing, this article will guide you through the basics and explain how to build a strong financial portfolio from the ground up.',
      url: 'https://www.fidelity.com/viewpoints/personal-finance/how-to-start-investing'
    },
    {
      title: 'Master Your Monthly Budget in 30 Minutes',
      type: 'Video',
      description: 'A quick, 30-minute tutorial that teaches you how to create and manage a monthly budget using proven techniques and easy-to-use tools.',
      url: 'https://www.youtube.com/watch?v=aFLVTJjfTM8'
    },
    {
      title: 'Emergency Fund: Why It’s Crucial and How to Build One',
      type: 'Article',
      description: 'This article explains the importance of having an emergency fund and offers tips on how to build one to ensure financial stability.',
      url: 'https://www.nerdwallet.com/article/banking/emergency-fund-why-it-matters'
    },
    {
      title: 'Debt Management: Get Out of Debt Faster',
      type: 'Video',
      description: 'Learn the top strategies for reducing and managing debt effectively. This video breaks down proven debt management techniques step by step.',
      url: 'https://www.youtube.com/watch?v=77922HIaDF8'
    },
    {
      title: 'Smart Ways to Reduce Your Expenses',
      type: 'Article',
      description: 'Find out clever ways to cut down on your expenses without sacrificing the things you love.',
      url: 'https://www.incharge.org/financial-literacy/budgeting-saving/how-to-cut-your-expenses/'
    },
    {
      title: 'Financial Planning: Set Realistic Goals',
      type: 'Video',
      description: 'Setting realistic financial goals is key to achieving financial success. Watch this video for tips on effective financial planning.',
      url: 'https://www.youtube.com/watch?v=ZhxaSvmc8SM'
    }
  ];
}
