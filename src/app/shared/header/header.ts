import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-header',
  imports: [MatButton, MatToolbar, RouterLink, RouterLinkActive, MatDivider],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
